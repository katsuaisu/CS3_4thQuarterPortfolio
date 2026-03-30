# Guided Questions and Answers
#### Credits to CoPilot for helping me layout my text properly because these were all originally comments on the html file. 

## Question 1: What changed compared to the default static positioning? Try to give different values to top and left or you can change it to bottom, right.

**Answer:** The footer is fixed at the bottom of the page so it won't move when you scroll.

## Question 2: What happens when you scroll the page? Why does the footer behave differently from position relative?

**Answer:** The footer stays at the bottom of the page even when you scroll while the sidebar scrolls with the content. This is because the footer has a fixed position, which means it does not move when you scroll. The sidebar has a relative position, which means it is positioned relative to its normal position and will move when you scroll.

## Question 3: What is the effect of position: absolute on an element? How is it different from fixed?

**Answer:** An element with position: absolute is: positioned relative to its nearest positioned ancestor (which is up the hierarchy of elements that has other values other than the default ones). An element with position: fixed is: positioned relative to the viewport. This means that an absolutely positioned element will move when you scroll, while a fixed element will stay in the same place on the screen.

## Question 4: Why does the notice appear on top of the content? What happens if you swap the z‑index values?

**Answer:** The notice appears on top of the content because it has a higher z-index value than the content which has a default z-index of 0. If you swap the z-index values, the content will appear on top of the notice instead, making the notice hidden behind the content.

## Question 5: What changes that you have to do on the code that will position .notice box on the top right corner of the .content box?

**Answer:** Nest the notice inside content so that the notice would have a parent element.
```html
<div class="content">
  <div class="notice">Notice!</div> 
</div>
```
Change content to relative and use the right property.
```css
.content {
  position: relative; 
  width: 300px;
  height: 200px;
}

.notice {
  position: absolute;
  top: 10px;   
  right: 10px; 
}
```

## Question 6: Try to change the position of .content to relative then to fixed. What do you observe each time?

**Answer:** When changing content to relative, it stays in its natural place and scrolls with the rest of the page. When changing content to fixed, it stays on a spot on the page and stays fixed.

## Question 7: What do you observe about the effect of z-index on .notice and .content boxes?

**Answer:** The element with the higher z-index value will appear on top of the other. A higher value on notice keeps it visible, but a higher value on content could hide the notice.

## Reflection

* **Static:** This is the default position where elements follow the natural order of the page.
* **Relative:** Lets you change an element's position from its original spot.
* **Absolute:** Lets an element position itself based on its parent element. An absolute positioned element looks for the nearest parent element that has a position value other than static. If it finds one, it treats the edges of that element as its walls for alignment.
* **Fixed:** Locks an element to its current position so it won't move when a user scrolls. Fixed is permanently attached to the screen from the start.
* **Sticky:** Acts as a relative element until you scroll to a default position (like top), and then it sticks to the edge of the screen and stays there.

**Practical Examples:**
* **Fixed:** Can be used for buttons for logging in/signing up so they are accessible and clickable.
* **Absolute:** Can be used to place a sign over an image.
* **Relative:** Can be used to slightly offset a favicon while keeping its original space.
* **Sticky:** Can be used for a navigation bar that stays at the top of the screen while scrolling.

