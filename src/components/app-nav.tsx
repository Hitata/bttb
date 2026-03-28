'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function AppNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/bazi" />}
            className={navigationMenuTriggerStyle()}
          >
            Bát Tự
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/bazi/cases" />}
            className={navigationMenuTriggerStyle()}
          >
            Cases
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/readings" />}
            className={navigationMenuTriggerStyle()}
          >
            Lá Số
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>Học</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-48 p-1.5">
              <li>
                <NavigationMenuLink
                  render={<Link href="/hexagrams" />}
                  className="block rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="font-medium mb-0.5">64 Quẻ</div>
                  <p className="text-xs text-muted-foreground">
                    Lục Thập Tứ Quái · I Ching
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  render={<Link href="/human-design" />}
                  className="block rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="font-medium mb-0.5">Human Design</div>
                  <p className="text-xs text-muted-foreground">
                    Thiết Kế Con Người
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
