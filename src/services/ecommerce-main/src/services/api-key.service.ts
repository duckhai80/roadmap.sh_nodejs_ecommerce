import { apiKeyModel } from "@/models";

class ApiKeyService {
  static findById = async (key: string) => {
    // const apiKeyObject = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });

    // console.log("🚀 ~ ApiKeyService ~ apiKeyObject:", apiKeyObject);

    const apiKeyObject = await apiKeyModel
      .findOne({ key, status: true })
      .lean();

    return apiKeyObject;
  };
}

export default ApiKeyService;
