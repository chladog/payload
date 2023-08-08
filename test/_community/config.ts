import { buildConfigWithDefaults } from '../buildConfigWithDefaults';
import { PostsCollection, postsSlug } from './collections/Posts';
import { MenuGlobal } from './globals/Menu';
import { devUser, regularUser } from '../credentials';
import { MediaCollection } from './collections/Media';
import Users from './collections/Users';
import Admins from './collections/Admins';

export default buildConfigWithDefaults({
  admin: {
    user: 'admins'
  },
  // ...extend config here
  collections: [
    Users,
    Admins,
    PostsCollection,
    MediaCollection,
    // ...add more collections here
  ],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  graphQL: {
    schemaOutputFile: './test/_community/schema.graphql',
  },

  onInit: async (payload) => {
    await payload.create({
      collection: 'admins',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    });

    const user = await payload.create({
      collection: 'users',
      data: {
        email: regularUser.email,
        password: regularUser.password,
      },
    });

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
        owner: user.id,
        readonly: {
          domain: 'mydomain',
          status: 'active'
        }
      },
    });
    payload.logger.error('TO SEE THE ERROR NAVIGATE TO: http://localhost:3000/api/posts/hostname/mydomain');
  },
});
