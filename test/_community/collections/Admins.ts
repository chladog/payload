import { CollectionConfig } from "../../../src/collections/config/types";

const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  hooks: {},
  fields: [
  ],
};

export default Admins;
