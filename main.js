;(function() {
  var sections = document.querySelectorAll('section')
  var pagination = document.querySelector('.pagination')
  var sectionsWrapper = document.querySelector('.sections')
  var dots = document.querySelectorAll('.dot')

  var touchStartX = null
  var touchStartY = null
  var touchMoveX = null
  var touchMoveY = null

  var animationDuration = 700
  var currentSlide = 0
  var slidesNumber = sections.length
  var wheelIsTurning = false
  var isAnimating = false

  // --- DOM UPDATERS ---

  // Highlights active pagination dot
  function changePagination(index) {
    dots.forEach(function(element) {
      element.classList.remove('active')
    })

    dots[index].classList.add('active')
  }

  // Move slides up or down
  function changeSection(slideIndex) {
    if (isAnimating) return

    isAnimating = true
    console.log('animation start')
    sectionsWrapper.style.transform = 'translate3d(0, ' + slideIndex * -100 + 'vh, 0)'
    currentSlide = slideIndex
    changePagination(slideIndex)
    setTimeout(handleAnimationEnd, animationDuration)
  }

  // --- EVENT HANDLERS ---

  function handleAnimationEnd() {
    isAnimating = false
    console.log('animation stop')
    window.removeEventListener('wheel', handleWheel)
  }

  function handleDotClick() {
    changeSection(Array.from(this.parentElement.children).indexOf(this))
  }

  function handleWheelStop(event) {
    wheelIsTurning = false
    console.log('wheel stop')
    window.addEventListener('wheel', handleWheel)
  }

  function handleWheel(event) {
    event.preventDefault()
    event.stopPropagation()

    console.log('handleWheel')
    if (wheelIsTurning || isAnimating) return

    wheelIsTurning = true

    console.log('handleWheel', event.deltaY === 1 ? 'UP' : 'DOWN')

    if (event.deltaY === 1) handleSwipeUp()
    if (event.deltaY === -1) handleSwipeDown()
  }

  function handleSwipeUp() {
    changeSection(Math.min(currentSlide + 1, slidesNumber - 1))
  }

  function handleSwipeDown() {
    changeSection(Math.max(currentSlide - 1, 0))
  }

  // Saves touchStart coordinates
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  // Saves touchMove coordinates
  function handleTouchMove(event) {
    touchMoveX = event.touches[0].clientX
    touchMoveY = event.touches[0].clientY
  }

  // Checks a difference between touchStart and touchMove coordinates
  function handleTouchEnd() {
    // Don't do anything if we didn't move the "cursor"
    if (touchMoveX === null || touchMoveY === null) return

    // Calculate the distances between touchStart and touchMove points
    const horizontalDifference = touchStartX - touchMoveX
    const verticalDifference = touchStartY - touchMoveY

    // If we're swiping vertically (horizontal swipe distance is smaller than the vertical one)...
    if (Math.abs(horizontalDifference) < Math.abs(verticalDifference)) {
      // Call proper callback depending on the swipe direction
      verticalDifference > 0 ? handleSwipeUp() : handleSwipeDown()
    }

    // Clear touch coordinates so we can start measuring again
    touchStartX = null
    touchStartY = null
    touchMoveX = null
    touchMoveY = null
  }

  // --- EVENT LISTENERS ---

  window.addEventListener('wheel', handleWheel)

  window.addEventListener(
    'wheel',
    _.debounce(handleWheelStop, 40, {
      leading: false,
      trailing: true
    })
  )

  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchmove', handleTouchMove)
  window.addEventListener('touchend', handleTouchEnd)

  dots.forEach(function(element) {
    element.addEventListener('click', handleDotClick)
  })
})()
