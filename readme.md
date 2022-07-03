# CyberRekt

## A discord bot for saving and loading server states

So you can make themed events that change the channels and roles to align with it, and easily go back to your default server mode later on!

## How much data is saved in a _"server state"_?

Currently only the channel and role names can be saved and retrieved by this bot.

## Commands

- `/backup save [slot] [title]` saves the server state to a given slot (from 1 to 9). It's also possible to give the backup a title for easy identification later.
- `/backup list` displays a list of all saved server states for the current guild.
- `/backup load [slot]` loads the server state from a given slot.