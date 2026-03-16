# CI Cloud Games Platform TVUI

A prototype that supports the Cloud Games Platform TVUI research using TV and SSIC.

## Getting Started

### Initial Setup

You only need to do these steps once.

1. Clone this repository by running `git clone git@github.com:NetflixDesign/ci-cloud-games-tvui.git`
2. Navigate into the directory with `cd ci-cloud-games-tvui`
3. Install the dependencies with the command `npm install`

### Running the Project

Do these steps every time you'd like to start the project.

1. Turn off VPN on your laptop
2. Run `npm run dev -- --host`
3. Open the "Network" URL that's displayed in the terminal. For example, `http://192.168.50.119:5173/`

> Note: this project will not work if you use the `localhost` URL.

## Testing it out

The page that opens in the browser represents the TV prototype. To connect a phone, press 'c' and scan the QR code.

> Note: the phone must be on the same network as the laptop

Once the phone is connected, the controller sidebar on TV will update.
As you tap buttons on the phone, it will show you the most recent button that was pressed.

## Advanced Usage

### Hardcoding a Room ID

#### TV

Pass the `tvRoomId` query parameter to the TV prototype to hardcode a room ID. For example, `?tvRoomId=000099`.

#### Phone

Pass the `roomId` query parameter to the phone prototype. For example, `/controller?tvRoomId=000099`.

## Resources

This project uses [controller-example](https://github.com/NetflixDesign/controller-example) as a reference and [connection-server](https://github.com/netflixdesign/connection-server) as the backend.
