import Customer from "../../models/Customer";


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
    return existing.save();
  }
  return Customer.create(update);
}