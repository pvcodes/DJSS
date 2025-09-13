"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
    text?: string;
    className?: string;
}

export function ModeToggle({ text, className, ...props }: ModeToggleProps) {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button onClick={toggleTheme} variant={null} className={cn(className)} {...props}>
            {theme === "dark" ? <Sun /> : <Moon />}
            <span>{text ?? 'Toggle Theme'}</span>
        </Button>
    )
}