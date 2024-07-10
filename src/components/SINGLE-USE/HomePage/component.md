# HomePage Component

a client component for the main route

## main component

```js
export default function HomePage()
```

## other components

```js
function DynamicHomePageRenderItem({ i, mediaSrc, mediaName });
function HeadPanel(){}
function SoundControl(){}
```

### States

```js
import audioFilesStore from "@/zustand/audioFiles.store";
import searchAudioStore from "@/zustand/searchAudio.store";
```

### Context

```js
const { getAudios }: any = useGlobalContext();
const { handleVolume, audioVolume }: any = useAudio();
```

### Handlers

| handler   | type  | description                         |
| --------- | ----- | ----------------------------------- |
| getAudios | async | for getting all the audio files api |
