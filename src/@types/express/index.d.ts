import { ApiKey } from "@/models/api-key.model";
import { KeyStore } from "@/models/key-store.model";
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
