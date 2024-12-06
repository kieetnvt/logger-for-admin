## Update for fork repo

Using field `email` to logged user email, who will be tracked. Not use `User` table, because the application don't have `User` table.

#### Want to logging for specific resource:

Add Log feature into resource definition:  using email of user's logged in to AdminJS

```
features: [
    loggerFeature({
      componentLoader,
      propertiesMapping: {
        email: 'email',
      },
      userIdAttribute: 'email',
    }),
  ],
```

And define the Log resource: `src/adminCMS/resources/log.resource.ts` using email of user's logged in to AdminJS

```
import { createLoggerResource } from '@kietnvt/logger-for-admin';
import { LogModel } from '../../schemas/log.schema.js';
import { componentLoader } from '../components/index.js';

const config = {
  resource: LogModel,
  componentLoader,
  featureOptions: {
    componentLoader,
    propertiesMapping: {
      recordTitle: 'title',
      userIdAttribute: 'email',
      resourceOptions: {
        navigation: {
          name: 'Log',
        },
      },
    },
  },
};

export default createLoggerResource(config);
```

# Logger Feature for AdminJS

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) feature which logs changes to resources.

## AdminJS

AdminJS is an automatic admin interface which can be plugged into your application. You, as a developer, provide database models (like posts, comments, stores, products or whatever else your application uses), and AdminJS generates UI which allows you (or other trusted users) to manage content.

Check out the example application here: https://adminjs-demo.herokuapp.com/admin/

Or visit [AdminJS](https://github.com/SoftwareBrothers/adminjs) github page.

## Usage

See an example application in the repository: [Example App](https://github.com/SoftwareBrothers/adminjs-logger/tree/master/example)

## License

AdminJS is copyrighted © 2023 rst.software. It is a free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About rst.software

<img src="https://pbs.twimg.com/profile_images/1367119173604810752/dKVlj1YY_400x400.jpg" width=150>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://www.rst.software/estimate-your-project).
* If you want to work for us - check out the [career page](https://www.rst.software/join-us).
