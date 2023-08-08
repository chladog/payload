import { CollectionConfig } from "../../../src/collections/config/types";


const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 1209600,
  },
  admin: {
    defaultColumns: [
      "email",
    ],
    useAsTitle: "email",
  },
  versions: {
    drafts: false,
    maxPerDoc: 10,
  },
  fields: [
  ],
};

export default Users;
