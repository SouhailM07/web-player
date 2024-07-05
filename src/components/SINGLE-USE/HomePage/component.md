# HomePage Component

a client component for the main route

## main component

```js
export default function HomePage()
```

## other components

```js
function HomePageRenderItem({ i, mediaSrc, mediaName });
```

### States

```js
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import playStore from "@/zustand/play.store";
```

### Handlers

- getAudios : async() : for getting all the audio files api
