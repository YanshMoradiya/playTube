
export interface NavbarItem {
    path: string;
    title: string; 
    cName: string;
    icon: string;
}

export const navbarData: NavbarItem[] = [
    {
        path: "/",
        title: "Home",
        cName: "navtext",
        icon: "home-sharp",
    },
    {
        path: "/search",
        title: "Search",
        cName: "navtext",
        icon: "search-sharp",
    },
    {
        path: "/history",
        title: "History",
        cName: "navtext",
        icon: "reload-sharp",
    },
    {
        path: "/tweets",
        title: "Tweets",
        cName: "navtext",
        icon: "send-sharp",
    },
    {
        path: "/subscriptions",
        title: "Subscriptions",
        cName: "navtext",
        icon: "people-sharp",
    }
];

