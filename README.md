# Onepager 0.1 #

A plugin that handles mobile menus and menu highlighting.

## Requirements ##
- jQuery
- The stylesheet requires less.

## Usage ##

### Setup ###

`$('#menu').onepager();`

The `#menu` should be designed similar to:
```
<nav id="menu">
	<ul>
		<li><a href="#first">First</a></li>
		<li><a href="#second">Second</a></li>
		<li><a href="#third">Third</a></li>
		<li><a href="#fourth">Fourth</a></li>
	</ul>
</nav>
```

where each href attribute is the id of the sections that should be viewed:

```
<section id="first">
</section>
<section id="second">
</section>
<section id="third">
</section>
<section id="fourth">
</section>
```

### Settings ###

Settings is passed as attributes:
```
$('#menu').onepager({ 
	setting: value 
});
```

#### General ####

##### activeType #####
Defines the type of highlight for active links.
- 'bar' - set a bar above the active link.
- 'color' - highlight by text color.
- 'box' - highlight by background color.
- 'none'
Default is 'bar'.

#### Mobile ####
##### mobileBreakpoint #####
The breakpoint in px. Default is 768.

##### mobilePosition #####
The position of the mobile menu. 'top', 'left' or 'right'. Default is 'top'.

##### mobileToggleFloat #####
Set the toggle icon to either 'left' or 'right'. Default is 'left'.

##### mobileMenuWidth #####
If mobilePosition is either left or right, then this defines the width of the menu. Given in %. Default is '70%'.

##### mobileMenuFixed #####
If the top menu bar should be fixed or not. Default is false.

##### mobileToggleIcon #####
Set a custom menu icon. Default is the hamburger.

# Author #

Author: Alfred Yrelin
Contact: alfred@yrelin.se
Website: http://www.yrelin.se