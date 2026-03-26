import { ApiKey } from "@/models/apiKey.model";
import { KeyStore } from "@/models/keyStore.model";
import { JWTAuthPayload } from "@/utils";

declare global {
  namespace Express {
    interface Request {
      apiKeyObject?: ApiKey;
      keyStore?: KeyStore;
      shop: JWTAuthPayload;
    }
  }
}
