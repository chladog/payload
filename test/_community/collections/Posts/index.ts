import type { CollectionConfig } from '../../../../src/collections/config/types';
import { FieldAccess } from '../../../../src/fields/config/types';


export const fieldIsSelf: FieldAccess = ({ req: { user }, doc, id }) => {
  const condition = userIsAdmin(user);
  if (condition) {
    return condition;
  }
  if (user) {
    return doc.id === user.id || id === user.id;
  } else {
    return false;
  }
};
export const postsSlug = 'posts';
export const userIsAdmin = (user) => {
  if (!!user) {
    if (user.collection === "admins" || !!user.isAdmin) {
      return true;
    }
  }
  return false;
};
export const userIsUser = (user) =>
  userIsAdmin(user) || (!!user && user.collection === "users");
export const fieldIsAdmin: FieldAccess = ({ req: { user } }) =>
  userIsAdmin(user);
export const fieldIsUser: FieldAccess = ({ req: { user } }) => userIsUser(user);
export const fieldIsOwner: FieldAccess = ({ req: { user }, doc }) => {
  if (userIsAdmin(user)) {
    return true;
  }
  if (user) {
    return user.id === doc?.owner;
  }
  return false;
};

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  access: {
    read: () => true
  },
  endpoints: [
    {
      path: "/hostname/:hostname",
      method: "get",
      handler: async (req, res, next) => {
        try {
          console.log(req.params.hostname);
          res.json(await req.payload.find({
            collection: "posts",
            overrideAccess: false,
            req,
            where: {
              and: [
                {
                  readonly__domain: {
                    equals: req.params.hostname,
                  },
                },
                {
                  readonly__status: {
                    equals: "active",
                  },
                },
              ],
            },
          }));
        } catch (err) {
          console.error(err);
        }
      }
    }
  ],
  fields: [
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      access: {
        read: fieldIsSelf
      }
    },
    {
      name: 'text',
      type: 'text',
    },
    {
      type: "group",
      name: "readonly",
      access: {
        read: fieldIsOwner,
        create: fieldIsAdmin,
        update: fieldIsAdmin,
      },
      fields: [
        {
          name: "domain",
          type: "text",
          label: 'Domain',
          index: true
        },
        {
          name: "status",
          type: "select",
          options: [
            {
              value: "active",
              label: "Active",
            },
            {
              value: "inactive",
              label: "Inactive",

            },
          ],
          defaultValue: "active",
        },
      ],
    }
  ],
};
