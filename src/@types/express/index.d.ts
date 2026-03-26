import { ApiKey } from "@/models/apiKey.model";
import { KeyStore } from "@/models/keyStore.model";

declare global {
  namespace Express {
    interface Request {
      apiKeyObject?: ApiKey;
      keyStore?: KeyStore;
    }
  }
}
