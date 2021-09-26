# Music Discovery Tracking App

### Pending improvements:
- ~~Add delete confirmation on click~~
- ~~'Liked/Disliked' functionality. Clicking thumbs up or thumbs down will move album below to Liked or Disliked list.~~
- ~~Add show/hide button for all lists.~~
- ~~Add ability to archive and clear album list. User will be allowed to view previously archived snapshots on read-only pages.~~
- Force strong password.
- Refactor main.js - add event listener on parent element (then check what is clicked) OR use inline onclick attr in EJS (https://stackoverflow.com/questions/35446496/how-do-i-pass-a-variable-to-inline-javascript-using-ejs-templating-engine/35446517#35446517)
- Make app responsive (mobile)
- Update data structure so unique users can have their own album list to manage.
- Put app on Glitch for live hosting

Resources/Things to Note
- MongoDB documentation and Nodejs MongoDB driver may have slightly different implementations on certain functions (i.e. find function and projection argument)
- https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp