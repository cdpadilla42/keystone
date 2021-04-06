function calcCartTax(preTaxTotal) {
  return 0.025 * preTaxTotal;
}

const stripe = require('../../lib/stripe');

module.exports = async function checkout(_, args, context, info) {
  const graphql = String.raw;
  try {
    console.log('args: ', args);
    // 1. Recalculate the total for the price
    const order = args.cart.cart;
    const orderIDS = order.map((item) => item.id);
    // Get items from the DB that match the orderIDS
    // const itemsFromDB = await Item.
    const itemsFromDB = await Promise.all(
      orderIDS.map(async (orderID) => {
        console.log(orderID);
        return await context.executeGraphQL({
          context: context.sudo(),
          query: graphql`
            query GET_ITEM($id: ID!) {
              Item(where: { id: $id }) {
                id
                name
                img
                price
                description
                customizations {
                  id
                  name
                  title
                  options {
                    name
                    price
                  }
                }
              }
            }
          `,
          variables: {
            id: orderID,
          },
        });
      })
    );
    // const itemsFromDB = await context.lists.Item.find()
    //   .where('id')
    //   .in(orderIDS)
    //   .exec();
    let orderItems = [];
    console.log('itemsFromDB', itemsFromDB);
    console.log('order', order);
    // iterating through original order in case of duplicate items. Mongoose does not find these.
    const cartTotal = order.reduce((prev, item) => {
      // find the matching item
      const matchedItem = itemsFromDB.find(
        (dbItem) => dbItem.data.Item.id == item.id
      );
      // find the price
      console.log('matched item', matchedItem);
      // find the customization price
      // TODO DO THE ABOVE! GOOD NEWS, You can extract this from that order simply by matching it with your item
      let addOns = 0;
      if (item.selectedOptions) {
        console.log('searching for addons');
        addOns = Object.keys(item.selectedOptions).reduce((prev, key) => {
          console.log(
            `searching for value of ${key} : ${item.selectedOptions[key]}`
          );
          if (item.selectedOptions[key] instanceof Array) {
            return prev;
          }
          const value = item.selectedOptions[key];
          const foundOption = matchedItem.data.Item.customizations.find(
            (customization) => customization.name === key
          );
          console.log('foundOption', foundOption);
          const foundCustomization = foundOption.options.find(
            (option) => option.name == value
          );
          console.log('found customization', foundCustomization);
          if (foundCustomization.price) {
            return foundCustomization.price + prev;
          }
          return prev;
        }, 0);
      }

      console.log('addOns', addOns);
      // add together and multiply by quantity
      console.log({
        price: matchedItem.data.Item.price,
        addOns,
        quanitity: item.quantity,
      });
      const totalCostofSingleItem =
        (matchedItem.data.Item.price + addOns) * item.quantity;

      // save price info to orderItems
      const resultItem = {
        id: matchedItem.data.Item.id,
        name: matchedItem.data.Item.name,
        description: matchedItem.data.Item.description,
        image: matchedItem.data.Item.image,
        price: totalCostofSingleItem,
        quantity: item.quantity,
      };

      orderItems.push(resultItem);

      // add to current total
      console.log('totalCostofSingleItem', totalCostofSingleItem);
      return prev + totalCostofSingleItem;
    }, 0);

    console.log('calculated total', cartTotal);

    const amount = cartTotal + Math.floor(calcCartTax(cartTotal));

    // 2. Create the stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: args.token,
      description: 'greetings from the resolver',
    });
    console.log(charge);

    // 3. Save Order to DB
    console.log('orderItems', orderItems);

    const renderOrderItemMutations = () => {
      return orderItems
        .map((orderItem) => {
          return `
          {
            name: "${orderItem.name}"
            description: "${orderItem.description}"
            image: "${orderItem.image}"
            price: ${orderItem.price}
            quantity: ${orderItem.quantity}
          }
        `;
        })
        .join(', ');
    };

    console.log(renderOrderItemMutations());

    const newOrder = await context.executeGraphQL({
      context: context.sudo(),
      query: graphql`
        mutation CREATE_ORDER($total: Int!, $charge: String!) {
          createOrder (data: {
            charge: $charge,
            total: $total
            items: {
              create: [
                ${renderOrderItemMutations()}
              ]
            }
          }){
            id
            charge
            total
            items {
              id
            }
          }
        }
      `,
      variables: {
        total: amount,
        charge: charge.id,
      },
    });

    // 4. Return order to the client
    console.log('New Order: ', newOrder);
    return newOrder.data.createOrder;
  } catch (err) {
    throw new Error(err);
  }
};
