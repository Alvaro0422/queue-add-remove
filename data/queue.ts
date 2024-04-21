import { atom } from "jotai";

export interface QueueData{
    name: string;
    row: number;
}

const queueListAtom = atom<QueueData[]>([
    {name: 'Jane', row: 1},
    {name: 'Jimmy', row: 1},
    {name: 'Alex', row: 2},
    {name: 'Andrew', row: 2},
    {name: 'Jeremy', row: 2},
    {name: 'Stephen', row: 2},
    {name: 'mario', row: 2},
    {name: 'July', row: 3},
])

export default queueListAtom;