# FAST DViz - COVID Prediction Dashboard Design Concepts Challenge
* [API](#api)
* [Challenge Summary](#challenge-summary)
* [Full Description & Project Guide](#full-description-&-project-guide)
* [EXPLORATION SCORE](#exploration-score)

### API
#### [covid api](https://covidtracking.com/api)

### Challenge Summary
Welcome to the FAST DViz - COVID Prediction Dashboard Design Concepts Challenge. In this challenge, we are looking to design an interactive page COVID Tracking Dashboard. 

Read the challenge specification carefully and watch the forums for any questions or feedback concerning this challenge. Let us know if you have any questions in the challenge forum!

##### Challenge Objectives

* Web Application
* 1 Dashboard Screen
* Concept Design

> Please read the challenge specification carefully and watch the forums for any questions or feedback concerning this challenge. It is important that you monitor any updates provided by the client or Studio Admins in the forums. Please post any questions you might have for the client in the forums.

### Full Description & Project Guide
#### OVERVIEW
The customer already has a dashboard, it is a bit slow and the design is not up to their mark.  So, they are looking to replace it now with a better design that will improve the user experience drastically.

Design and build an interactive one page HTML5 COVID tracking dashboard.  This new dashboard will support 100 users, will be hosted on AWS. Where there are separate “boxes” of data on the screen, load them asynchronously - page shouldn’t wait to load everything before it loads anything.  When a country, state, or county is picked, the goal is to update all related info on the screen automatically.  The app is read-only.  Some data is shown at all times, some are filtered. 

#### ABOUT THIS MODEL
This model forecasts what the infection and death rates will be at the county level, according to the quarantine policy selected by the user.  It captures 7 countries.  The polices are “no measure”, “lockdown”, “restrict mass gatherings”.  More may be added later.

#### AUDIENCE
- Target is 100 users, executives, and researchers. 
- This is an internal app - but the VP's are using it.

#### DESIGN GOALS & PRINCIPLES
Below are some of the goals:

* We have provided some references to help you get started, this is just for reference - please do NOT copy.
* Elegant, clean, simple, user-centered look and feel with a modern aesthetics
* The overall design and user experience
* Engaging and easy-to-use/interact UI
* How well does your design align with the objectives of the challenge
* ���**Design for a relatively easy UI, so we build it quickly** *- we will launch development immediately after this, and we want to complete the whole project within 7 days.*

### EXPLORATION SCORE
In terms of expectations, we would like to measure the concept against the following in the one to ten scales (ask the client to rate each of the parameters):

* Creativity: 10
    * 1: barely new ideas
    * 10: a utopic product with features proven to be able to be fully implemented

* Aesthetics: 10
    * 1: low-fidelity design, wireframe or plain sketch
    * 10: top-notch finished looking visual design

* Exploration: 7
    * 1: strictly follow an existing reference or production guideline
    * 10: open to alternative workflows/features not listed here that would help the overall application

* Branding: 7
    * 1: don’t care at all about the branding just functionality
    * 10: without a properly branded product there is no success

#### REFERENCES:
- https://www.statnews.com/feature/coronavirus/covid-19-tracker/: Customer likes this site for the clean layout but dislikes the black background:
- https://coronavirus.jhu.edu/map.html : The Customer likes this site for the layout and interaction, you can use this as a base for this new design (just the layout, please do not copy the design as it is) - we have also supplied a wireframe layout based on this, you can follow that. (just the world view - ignore the other two). 

#### BRANDING GUIDELINES
For the maps and graphs, Keep the color scheme used on the existing screen/map as these colors have a wider meaning

#### SCREEN REQUIREMENTS
For this challenge, we are looking for the below screens to be created in your submission. The functionality details listed below need to be included in your solution:

#### 01) COVID Tracking Dashboard:
We have also supplied a wireframe layout based on this, you need not strictly follow that - if you have better ideas - you can show that!

*Filters:*
* We need filters, think about where it would be appropriate to show the filters
* See the existing design for the list of filter items
    * Show the legend. 
    * Replace “Weeks” from the existing design with a date range picker.  
    * Keep Policy filter

* Leftside:
    * Total Confirmed Cases
    * Confirmed Cases by Country, State, and County
    * Last Updated on (Date and time can be shown here)

* Main Content
    * World view: 
        * Opens the world map and shows focus on the U.S
        * Clicking on a country should allow them to see more detail.
    * State/Province + County Map:
        * When clicking on the state within the country view, shows the updates state/province view
        * When the state has issues 
        * It would be nice to have the maps expanded into overlays.
    * Other information that is required based on the selection:
        * The plot of infections by whatever is picked on the map.
        * Show the Global Deaths & State level deaths

#### IMPORTANT
* Keep things consistent. This means all graphics styles should work together
* All of the graphics should have a similar feel and general aesthetic appearance

#### MARVEL PROTOTYPE
* We need you to upload your screens to Marvel App
* Please request for marvel app in the challenge forum 
* You MUST include your Marvel app URL (in your marvel app prototype, click on share and then copy the link & share it with your notes/comment on this link while you upload)

#### TARGET DEVICE
* Desktop: 1366px width and height 768px  

#### SUBMISSION AND SOURCE FILES
**Submission File**
* Submit all JPG/PNG image files based on Challenge submission requirements stated above

**Source File**
* All source files of all graphics created in either Adobe Photoshop, Illustrator or XD or Sketch or Figma and saved as an editable layer

**Declaration File**
* Declaration files document contains the following information:
    * Stock Photos Name and Source Links from an allowed sources
    * Stock Art/Icons Name and Source Links from an allowed sources
    * Fonts Name and Source Links source from an allowed source
    * MarvelApp share link for review 

**FINAL FIXES**
* As part of the final fixes phase, you may be asked to modify content or user click paths

#### Stock Photography
Stock photography is not allowed in this challenge. All submitted elements must be designed solely by you. [See this page for more details](http://help.topcoder.com/hc/en-us/articles/217481408-Policy-for-Stock-Artwork-in-Design-Submissions).
