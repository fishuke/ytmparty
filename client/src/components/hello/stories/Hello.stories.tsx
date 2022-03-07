import * as React from "react";
import { Hello } from "../component";

// // // //

export default {
    title: "Components/Hello",
    component: Hello,
} as ComponentMeta<typeof Hello>;

export const Render = () => <Hello />;
