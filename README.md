# Description

This is the web frontend for the block-sudoku project.

# Deployment

The project is currently hosted on GitHub Pages at https://maxpower01.github.io/block-sudoku-frontend-web/ using the `gh-pages` branch. Note that the `gh-pages` branch is not a regular branch, but a subtree of the `main` branch that only contains the `dist` subdirectory. This is done to make it easier to publish the project to GitHub Pages.

**Steps to publish:**

1. Switch to the `main` branch if not already on it.

2. Build the project.

```bash
npm run build
```

3. Push the changes to the `main` branch.

4. Publish the subdirectory `dist` to the `gh-pages` branch.

```bash
git subtree push --prefix dist https://github.com/MaxPower01/block-sudoku-frontend-web.git gh-pages
```

The site will then be available at https://maxpower01.github.io/block-sudoku-frontend-web/ after a few minutes.
