import { Routes } from '@angular/router';
import { Chat } from './components/chat/chat'
import { Instruction } from './components/instruction/instruction';

export const routes: Routes = [
    { path: '', component: Chat },
    { path: 'how-to-play', component: Instruction }
];
