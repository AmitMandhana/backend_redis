import Customer from "../../models/Customer";
import redis from "../../utils/redis";


export async function getAllCustomersService(userId: string) {
    try {
        const customers = await Customer.find({ userId });
        if (!customers || customers.length === 0) {
            return [];
        }
        return customers;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw new Error("Error fetching customers");
    }
}

export async function createOrUpdateCustomerService(
  userId: string,
  params: { name: string; email: string; phone?: string; location?: string; externalId?: string }
) {
  const { name, email, phone, location, externalId } = params;
  const query: any = { userId };
  if (externalId) {
    query.externalId = externalId;
  } else {
    query.email = email;
  }

  const update = {
    userId,
    name,
    email,
    phone: phone || undefined,
    location: location || undefined,
    externalId: externalId || undefined,
  };

  const existing = await Customer.findOne(query);
  if (existing) {
    Object.assign(existing, update);
    const saved = await existing.save();
    // Publish event to Redis
    await redis.publish("customer:updated", JSON.stringify(saved));
    return saved;
  }
  const created = await Customer.create(update);
  // Publish event to Redis
  await redis.publish("customer:created", JSON.stringify(created));
  return created;
}