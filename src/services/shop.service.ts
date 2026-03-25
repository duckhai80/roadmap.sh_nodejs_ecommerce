import { shopModel } from "@/models";

class ShopService {
  static findOneByEmail = async (
    email: string,
    select = { email: 1, password: 1, status: 1, roles: 1 },
  ) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };
}

export default ShopService;
