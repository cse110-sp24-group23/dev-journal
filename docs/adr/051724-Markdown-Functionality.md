# Markdown Functionality

## Context and Problem Statement

We want a way to implement markdown editing in our dev journal to allow developers to style their logs and notes. We want to find a 
simple embed that allows us to save text in a markdown file.

## Considered Options

* PandaO Editor
    * Customizable but would add complexity, and writeup was in a different language
    * Only split screen view for editor (editing side and preview side)
* Toast UI Editor
    * Feature bloat: too much added functionality
* Mark Text
    * Documentation was not good
    * Output into PDF or HTML files, but we want to save in Markdown files
* SimpleMDE
    * Easily customizable
    * Simplest option out of the researched editors

## Decision Outcome

Chosen option: SimpleMDE

We will use SimpleMDE for markdown editing in the daily logs and notes. SimpleMDE was customizable and streamlined, and many people 
recommended it over other editors. We want to include the autosaving feature and customize their toolbar to provide the most important 
styling options. We could also style this embed to align with our style guide. There is the potential for an XSS attack where a user 
could inject JavaScript through a link to a script tag, but because this is a local application with only the user’s data, there is no 
vulnerable data that an XSS attack could exploit. We decided this wasn’t a large enough issue to discourage use of Markdown text editing.
