import Order from '../../models/Order';
import redis from '../../utils/redis';

export async function getAllOrdersService(userId: string) {
  try {
    const orders = await Order.find({ userId: userId });
    if (!orders) {
      return null;
    }
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
}

export async function createOrderService(userId: string, orderData: any) {
  try {
    const newOrder = await Order.create({ ...orderData, userId });
    // Publish event to Redis for order creation
    await redis.publish('order:created', JSON.stringify(newOrder));
    console.log('Published order:created event to Redis Pub/Sub for new order creation.');
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}
