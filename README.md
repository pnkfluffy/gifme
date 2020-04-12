# gifme
A gif making and sharing app. Users can take photos and/or gifs, apply filters and stickers over them. Or they can simply browse through the infinitely-scrollable homepage through other uploaded gifs. Photos and gifs can be rated, commented on, and exported to different forms of social media. Users have public facing profiles, and can see all the posts that they have favorited in the past. Additionally then can edit their profile, delete their posts, or delete their accounts.

This app was built using the MERN stack, folliwing a MVC structure. Stickers are pulled dynamicly from the Giphy API. Multer and Mongoose were used for binary data storage on MongoDB, and gifshot and gif-frames were used for deconstruction and reassembly of the GIFs.


![Gifme Home Page](https://cdn.discordapp.com/attachments/613478885174018084/698394976173686784/gifme_frontpage.gif)

To Do:
* Make a user-side cache for gifs to reduce strain on the server
* Enable offset so multiple pages can be
* Allow users to delete gif stickers from the photo editing area
* Allow users to resize gif stickers in the photo editing area
* Impliment gif tagging system with a searching system
* Impliment in React Native as an App interface
