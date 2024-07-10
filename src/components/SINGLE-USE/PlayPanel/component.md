# PlayPanel component

A client side component act like a control panel for the audio , it contain ui for:

- volume control
- audio control
- track line control

## Main Component

```js
export default function PlayPanel()
```

## Small Components

```js
function SoundControl({ audioRef })
function Controls({ audioRef })
function TrackLine({ audioRef, duration, currentTime })
```

### Context

```js
const { controls }: any = useAudio();
const { handleSliderChange, sliderValue, audioInstance }: any = useAudio();
const { handleVolume, audioVolume }: any = useAudio();
```

### Handlers

| handler            |
| ------------------ |
| handleSliderChange |
| handleVolume       |
