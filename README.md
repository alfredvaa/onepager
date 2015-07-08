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

mobile:
Width where mobile menu is toggled.

type:
bar - show a color bar as active indicator
color - highlight active link with color


# Author #

Author: Alfred Yrelin
Contact: alfred@yrelin.se
Website: http://www.yrelin.se