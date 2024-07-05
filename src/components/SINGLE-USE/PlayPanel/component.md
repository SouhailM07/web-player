# PlayPanel component

A client side component for the main route ,

## Main Component

```js
export default function PlayPanel()
```

## Small Components

```js
function SoundControl({ audioRef }) {}
function Controls({ audioRef }) {}
function TrackLine({ audioRef, duration, currentTime }) {}
```

## States

```js
import selectedAudioStore from "@/zustand/selectedAudio.store";
import playStore from "@/zustand/play.store";
//
const [duration, setDuration] = useState(0);
const [currentTime, setCurrentTime] = useState(0);
//
const [sliderValue, setSliderValue] = useState(0);
```

## Handlers
