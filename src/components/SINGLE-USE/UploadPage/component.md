# UploadPage component

A client side component , made with [MyDialog] component , to submit and upload an audio file , it can check if the file is exist before it's upload it , and can also check if the audio file is valid or not .

## Main Component

```js
export default function UploadPage()
```

## Small Components

```ts
function LinksRenderItem({ icon, ariaLabel }: links_t);
```

## States

```js
import loadingStore from "@/zustand/loading.store";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
```

## Context Api

- LOCAL_CONTEXT = ({ children }: { children: ReactNode })
- UploadContext

## Handlers

```js
//
function onSubmit(values)
async function getAudios()
// context handlers
// none
```
