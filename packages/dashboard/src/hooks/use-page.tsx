import { PageProvider } from "@/framework/layout-engine/page-layout.js";
import { useContext } from "react";

export function usePage() {
    const page = useContext(PageProvider);
    if (!page) {
        throw new Error('PageProvider not found');
    }
    return page;
}
    