module.exports = async function checkout(_, args, context, info) {
  try {
    console.log(args);
    // 1. Recalculate the total for the price
    const order = args.cart.cart;
    const orderIDS = order.map((item) => item.id);
    // Get items from the DB that match the orderIDS
    // const itemsFromDB = await Item.
    const { data: itemData, errors: itemErrors } = await context.executeGraphQL(
      {
        context: context.sudo(),
        query: `
      query {
        Item(where: {id: "5feb9ae1351036315ff45886"}) {
          id
          name
          img
          price
          description
        }
      }
      `,
      }
    );
    console.log(itemData, itemErrors);
    const itemsFromDB = await context.lists.Item.find()
      .where('id')
      .in(orderIDS)
      .exec();
    let orderItems = [];
    console.log('itemsFromDB', itemsFromDB);
    console.log('order', order);
    // iterating through original order in case of duplicate items. Mongoose does not find these.
    const cartTotal = order.reduce((prev, item) => {
      // find the matching item
      const matchedItem = itemsFromDB.find((dbItem) => dbItem._id == item.id);
      // find the price
      console.log('matched item', matchedItem);
      // find the customization price
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
          const foundOption = matchedItem.customizations.find(
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
        price: matchedItem.price,
        addOns,
        quanitity: item.quantity,
      });
      const totalCostofSingleItem =
        (matchedItem.price + addOns) * item.quantity;

      // save price info to orderItems
      const resultItem = {
        id: matchedItem._id,
        name: matchedItem.name,
        description: matchedItem.description,
        image: matchedItem.image,
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
    const newOrder = await new Order({
      items: orderItems,
      total: amount,
      charge: charge.id,
    });

    const result = await newOrder.save((err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Order saved to DB: ', res);
        return res;
      }
    });
    // 4. Return order to the client
    console.log(newOrder);
    return newOrder;
  } catch (err) {
    throw new Error(err);
  }
};
