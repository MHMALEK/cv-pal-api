# Hope project - VPN Server Creator

This tool is designed to create servers using the Linode API. It provides an automated solution for managing servers, including the ability to detect blocked servers, remove them, and add new ones. It also integrates a vpn tool from the [Reality EZPZ repository](https://github.com/aleskxyz/reality-ezpz) and adds VPN configurations to each server. 

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

This application is built using NodeJs, Express (as API), and uses SQL and SQLite for the database. Make sure all these are installed on your machine.

### Installation

1.  Clone the repo
    
    ```
    git clone https://github.com/your_username_/Project-Name.git
    
    ```
    
2.  Install NPM packages
    
    ```
    npm install
    
    ```
    
3.  Copy the  `env.sample`  file and create your own  `.env`  file. Replace the placeholders with your actual data (Linode API token, Telegram Bot API token, etc.)

## Usage

Once you've set up the project, you can define how many servers you want to create and how many configurations each server should host. The application automatically checks servers every 2 hours, and if a server is blocked, it replaces it, removes old configurations, and adds new ones.

An optional Telegram bot is available for end users. They can start and register to receive a new config via the bot (IPV4 and IPV6 vless config). At the moment, each user can only have one config every day to prevent misuse and overload. The current implementation does not save QR codes and send them to users, but this can be adjusted.

The server creation source can be adjusted as needed, but the new source must support adding SSH keys and removing/adding servers via API or CLI.

It was originally used X-Panel (install Xpanel and use API to create configs and users but we used other tool at the end. but some part of API and services are still there in case you're interested)
## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Final Notes

Your contributions will help provide free internet access to Iranians who currently do not have this right. More technical details will be provided on how things work. Please feel free to ask any questions or provide suggestions.


## TODO: 

- Add proper error logger (Sentry or logrocket for example)
- Add proper error handler
- this project is used to handle small amount of servers at same time (for bigger services, it wise to change arcitecture and improve it (for example use a Queue manager for servers and better error handler)
- Add proper tests which is not included
- Re-write using typescript (it's a small project that I was doing it over weekend so not much time to deal and add types. but feel free to improve it).
- Better approach for generate configs than running a command. (maybe use custom docker command when create linode or better way to improve this) 

## License

Distributed under the MIT License. See `LICENSE` for more information.