# Annotated Image / Image Map

This field-type allows users to add numbers on images for tutorials, so such numbers can be used in the frontend to refer to points of the image from the text content.

<img src="https://a.storyblok.com/f/88751/2880x1760/8868def9b0/plugins-23.jpg" alt="Image Map Preview">

Name | Description | Author
------------ | ------------- | -------------
Annotated Image | Simple Image Maps for tutorials | [Christian Zoppi](https://github.com/christianzoppi)

## Getting Started

```bash
# install dependencies
npm install

# start the dev server and open the printed Sandbox link
npm run dev

# deploy the plugin using our @storyblok/field-plugin-cli
npm run deploy
```

`npm run deploy` asks for your [personal access token](https://app.storyblok.com/#/me/account?tab=token), the plugin's name, and where to add it (My Plugins or Partner Portal).

Optional field option: `fallback_image`, an image URL that is used when no image is selected.

## Upgrading from the Vue 2 version

This plugin now uses Vue 3 and [@storyblok/field-plugin](https://www.storyblok.com/docs/plugins/field-plugins). The way you build and deploy it has changed:

- There is no `export.js` to paste into the field-type editor anymore. Deploy with `npm run deploy` instead.
- To update an existing plugin, deploy with the same name and choose to update it, for example `npm run deploy -- --name <your-plugin-name>`.
- Content saved by the Vue 2 version still works. The content shape (`image`, `mapNodes`) has not changed.
