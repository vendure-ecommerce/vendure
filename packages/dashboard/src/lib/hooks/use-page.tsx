import { PageContext } from "@/framework/layout-engine/page-layout.js";
import { useContext } from "react";

export function usePage() {
    const page = useContext(PageContext);
    if (!page) {
        throw new Error('PageProvider not found');
    }
    return page;
}
