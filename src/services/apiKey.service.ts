import apiKeyModel from "@/models/apiKey.model";

class ApiKeyService {
  static findById = async (key: string) => {
    // const newObjectKey = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });

    // console.log("🚀 ~ ApiKeyService ~ newObjectKey:", newObjectKey);

    const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();

    return objectKey;
  };
}

export default ApiKeyService;
