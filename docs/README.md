# Getting Started
`WARNING!`
**UNDER DEVELOPMENT DOCUMENTATION**

First, grab [shaderfy](https://raw.githubusercontent.com/rdlagemann/shaderfy/master/lib/shaderfy.js).
  
Load it through HTML:
```html
<body>
	...
	<script src="path/to/file/shaderfy.js"></script>
	<script src="js/index.js"></script>
</body>
```


Now `shaderfy` is in your global scope.
  
Visit the [sample page](https://rdlagemann.github.io/shaderfy-sample/) for current implemented shaders.

## Using a filter

Use `shaderfy.render(filterName, configObj)` to apply a shader.  

Example:
```javascript
// set a config object
let config = {
	canvas: document.getElementById('myCanvas'),
	image: myImage,
	stretchToCanvas: true
}

// use render to apply the filter!
shaderfy.render('edgeDetect1', config)

```

Filters available [here](/).  
More about `config` object [here](/).
