# Vendure - Licensing FAQ

## What is the license for Vendure?

Vendure and all contributed files in this Git repository are available under two different licenses:

* GNU General Public License version 3 (GPLv3)
* Vendure Commercial License (VCL)
  If you don't have a separate written licensing agreement between you and Vendure GmbH then always GPLv3 applies to you.

The following FAQ covers only GPLv3.

# GPLv3 FAQ

## What does "licensed under the GPLv3" actually mean?
That means you are free to download, reuse, modify, and distribute
any files hosted in the Vendure Git repository under the terms of the GPL version 3, and to run Vendure in
combination with any code with any license that is compatible with GPL version 3, such as the
Affero General Public License (AGPL) version 3.

## Does the license cover just TypeScript, or everything?
We require that all files in this repository (TypeScript, CSS, HTML) that are not part of a bundled 3rd party library are under the terms of the GPLv3.

## Copyright & contributions
All Vendure contributors retain copyright on their code, but agree to release it under the same licenses as Vendure.
If you are unable or unwilling to contribute a patch under the GPL version 3 and the Vendure Commercial License, do not submit a patch.

## I want to release my work under a different license than GPLv3, is that possible?
No. You can only release your work under any GPL version 3 or later compatible license.

## The GPL requires that I distribute the "source code" of my files. What does that mean for a web application?
The "source code" of a file means the format that is intended for people to edit.

For TypeScript, CSS, and HTML code, the file itself, without any compression or obfuscation, is its own source code.
The "source code" is whichever version is intended to be edited by people.

## If I write a plugin for my Vendure application, do I have to license it under the GPL?
Yes. Vendure plugins for your application are a derivative work of Vendure.
If you distribute them, you must do so under the terms of the GPL version 3 or later.

You are not required to distribute them at all, however.

However, when distributing your own Vendure-based work, it is important to keep in mind what the GPLv3 applies to.
The GPLv3 on code applies to code that interacts with that code, but not to data.
That is, Vendure's TypeScript code is under the GPLv3, and so all TypeScript code that interacts with it must also be
under the GPLv3 or GPLv3 compatible. Images and JSON files that TypeScript sends to the browser are not
affected by the GPL because they are data

When distributing your own plugin, therefore,
the GPLv3 applies to any pieces that directly interact with parts of Vendure that are under the GPLv3.
Images and other asset files you create yourself are not affected.

## If I write a plugin for my application, do I have to give it away to everyone?
No. The GPL requires that if you make a derivative work of Vendure and distribute it to someone else,
you must provide that person with the source code under the terms of the GPLv3 so that they may modify and redistribute
it under the terms of the GPLv3 as well. However, you are under no obligation to distribute the code to anyone else.
If you do not distribute the code but use it only within your organization,
then you are not required to distribute it to anyone at all.

However, if your plugin is of general use then it is often a good idea to contribute it back to the community anyway.
You can get feedback, bug reports, and new feature patches from others who find it useful.

## Is it permitted for me to sell Vendure or a Vendure plugin?
Yes. However, you must distribute it under the GPL version 3 or later,
so those you sell it to must be allowed to modify and redistribute it as well. See questions above.

## Do I have to give the code for my web site to anyone who visits it?

No. The GPL does not consider viewing a web site to count as "distributing",
so you are not required to share the code running on your server.

## I have a question not answered here. What should I do?
**If you have a question about your specific case, please consult with a copyright attorney in your area.**
**We cannot and will not offer legal advice.**

If you have a general question about Vendure licensing or other legal issues,
please post your question in the [Vendure discord community](https://vendure.io/community).

### Credits / License of this FAQ page
This FAQ is based on https://www.drupal.org/licensing/faq (modified)- many thanks to the Drupal Association!
License: Creative Commons Attribution-ShareAlike license 2.0 (http://creativecommons.org/licenses/by-sa/2.0/)   
