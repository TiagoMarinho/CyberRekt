# CyberRekt

 A discord bot for saving and loading server states, intended to be used after themed events to recover the original state of the server.

## How much data is saved in a _"server state"_?

Currently only the channel and role names can be saved and retrieved by this bot.

## Commands

### Backup

- `/backup save [slot] [title]` saves the server state to a given slot (from 1 to 9). It's also possible to give the backup a title for easy identification later.
- `/backup list` displays a list of all saved server states for the current guild.
- `/backup load [slot]` loads the server state from a given slot.
- `/backup manage [page]` brings up an interface that can be used to save and load backups with buttons.

### Rename

- `/rename channels affix [prefix] [suffix]` adds a prefix and suffix to the name of every channel from the server. 
- `/rename channels interpolate [separator]` adds a separator string between every character of every channel name from the server.

### Other

- `/asciiart [text] [font] [color]` draws ASCII art of the specified text with the chosen font, and using syntax highlighting to color the text with the chosen color.
- `/hash create [text]` hashes the provided string.
- `/hash compare [text] [hash]` hashes the provided text and compares it to the provided hash.