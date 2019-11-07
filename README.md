# EIP 1155 - Conditional tokens for the brave, true or false

This repo hosts the code for Gnosis' conditional tokens documentation site, explaining our unique implementation of EIP 1155 in order to create _conditional tokens_ ideally suited to prediction markets.

Anyone is free to add to or edit this code - the more documentation we get, the better.

## Adding a New Page

If you want to add a page to specific section, rather than just edit an existing page, you'll need to make sure your new page appears on the sidebar and is accessible to everyone.

1. Add your page to `source/<your_section>/<your_file_here>.md`
2. In `source/_data/sidebars.yml` add the appropriate text to the appropriate place.
3. In `themes/navy/languages/en.yml` edit the sidebars section to make sure that your new text in `sidebars.yml` is rendered correctly.

## Testing locally

Make sure you have node.js installed first.

1. Open Terminal and navigate to the project root directory,
2. Run `npm install`
3. Run `npm run build`,
4. In another terminal, run `npm run serve`.

## Contributing More

1. If you would like add new styles, you can find all the `sass` files in `themes/navy/source/scss` - add your own there and keep things modular, clean and performing well.
2. If you would like to add some JS for animations of images, or other potential bounties, the place to do that is `themes/navy/source/js`.
3. Changing the header, footer, mobile nav, or scripts (in `after_footer`) can be done in `themes/navy/layout/partial`.
4. Each new subdirectory gets it's own route, so if you want to add a new section like `conditional-tokens/extensions` or `conditional-tokens/contribute`, then just create a new directory in `source`, name it what you want the route to be called, and add an `index.md` file to it. 

If you want it to have a unique layout, set it up something like this:

```
---
layout: extensions
title: MultiToken Gaming Tutorial
id: index
---
```

and then create the appropriate `extensions.ejs` layout file in `themes/navy/layout`. `.ejs` files are _exactly_ like html - so just write html in there and don't stress.