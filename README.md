# DevWars Game

[Play DevWars Game](https://devwars-game.netlify.com)

## Story

On Saturday, 1/20/2019, I had the privilege to compete in a classic game of [DevWars](https://devwars.tv). In this game I was paired with two other teammates to compete against another team of three developers. We each had an assigned role, html, css, or javascript. I was in charge of the css, and we had to work together with one another to complete the objectives of the challenge in 60 minutes.

The challenge was this:

- Create a board game with 16 squares around a border
- Have a player and cpu take turns rolling a die
- After the roll, advance along the board that number of spaces
- If you land on a corner space, you get another roll that turn
- After 3 turns, whoever has gone the farthest along the board, wins

One interesting caveat with this challenge is that for the JS piece, you were not allowed to use any libraries or frameworks. While I have done a lot of work with JS now, I have never actually built things with vanilla JS. Our team worked together well, though, and while we did not complete the objective to allow an extra roll when landing on a corner space, we ended up winning the UI and UX votes putting us ahead of the other team.

I learned a lot during the experience, writing _only_ css, I had to communicate the DOM structure I expected to work with my selectors to my HTML teammate, and we both had to work with our JS teammate to make sure we weren't messing up the DOM introducing breaking changes for him. In 60 minutes and with no frameworks, you don't have time to build isolated components that allow you to refactor easily. Any change to the DOM could have breaking changes for the imperative JS code.

Now that the challenge is over, I want to rewrite the app using vanilla JS as an exercise for myself, and I then want to rewrite it with React.js, my preferred JS framework to see the differences. To make the comparison as close as possible, I am going to stick to using css on the React.js side instead of styled components or sass.
