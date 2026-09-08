# Martin Li — Engineering portfolio

Employer-oriented, black-and-white portfolio with five routes: `/`, `/projects/rocket`, `/projects/robotics`, `/projects/cisco-antigua`, and `/work-experience/trs`.

## Content and sources

The home page leads with Martin’s UCI mechanical engineering education, hands-on skills, and current paid TRS electrical device assembly technician role. About contains email, telephone, and a résumé PDF. Paid employment is separate from three selected project groups: rocketry, robotics, and the Cisco Antigua volunteer donation project.

Contact: mli-business@martin-li.com; +1 (206) 518-0965. TRS: August 2026–present, paid part-time. Academic standing: 4th year, graduates December 2027. Robotics: eight-person UCI team, two-legged running robot, SolidWorks and fabrication. Cisco Antigua: 50+ network devices configured/deployed, ten-person team, 200+ donated routers/projectors coordinated; volunteer work, not Cisco employment.

Content draws on the supplied résumé and prior project context. The PDF download preserves the clean earlier résumé, `Martin_Li_Mechanical_Engineering_Resume_Full_Page_Final.pdf`; it does not include the newly added TRS role. The uploaded Updated PDF has overlapping text and was not used as the employer-facing download.

TRS role reference: https://www.ziprecruiter.com/c/trs-international-mfg/Job/Assembler-Production-Line-Worker/-in-Lake-Forest,CA?jid=4da0798b632beed7

## Interactive models

`lib/rocket-model.ts` reconstructs the design from `content/rocket-design.json` and supplied component photographs. The unchanged `Rocket 2.rkt` is RockSim XML and remains downloadable. The original body length is 1,214.4 mm, with fins extending 5 mm aft. The browser model includes illustrative recovery and motor hardware beyond that dimensional design envelope. The updated Rocket 2.ork is now the primary download: AeroTech HP-H135W-14, 29 × 216 mm. Supplied saved simulation results show 716 m apogee, 157 m/s maximum velocity, and 11.1 s to apogee; they are predictions, not flight telemetry. The Design data tab also records the source’s high-speed deployment flag.

The rocket has 21 labeled component groups, including separate body tubes, three fins, three centering rings, nose bulkhead, metallic silver eye bolt, orange cloth parachute/protector, suspension lines, flexible shock cord, coupler, motor/mount/retainer, and two rail buttons. A continuous slider separates and reassembles the parts while keeping recovery lines attached. The exterior uses reflective aluminum-silver material without a logo.

Controls include orbit/zoom, keyboard rotation and zoom, assembly selection, wireframe, internal transparency, labels, optional rotation, reset, expanded view, and reduced-motion behavior. WebGL failure provides a dimensioned SVG and design download. Labels are leader lines over the live projected geometry.

The TRS role has a dedicated Work Experience page with specific assembly, testing, and troubleshooting responsibilities and a four-photo workbench journal. The home page retains a linked summary and real assembly photo. The former illustrative wire model has been removed.

## Native CAD

Four unchanged SolidWorks `.SLDPRT` files remain downloadable. They are not decoded by the browser. The reconstructed model must not be described as an exact SolidWorks export. Faithful native CAD previews require GLB or STL exports from SolidWorks.

## Authoring and hosting

Preserve the existing Sites project identity and source repository. The project uses Vinext, React, Three.js, and Radix/Shadcn controls. Main content is in `app/page.tsx` and `app/projects/*/page.tsx`; interactive viewers are in `components/` and geometry in `lib/`.

Verification: TypeScript validation, production build, and numerical geometry checks. No browser interaction or visual QA was requested or performed.

Target domain: martin-li.com (Squarespace registrar). Domain activation requires the previously supplied DNS records. Preserve existing email-related MX/TXT records.

The rocket page includes a launch-first field journal with the five supplied photographs and short personal captions. Launch footage is transcoded from HEVC to browser-compatible H.264/AAC with fast-start metadata; original uploads are preserved.

TRS company context and the credited company harness image are sourced from https://www.trsintl.com/ (image: https://img.waimaoniu.net/4792/4792-202601302141378736.jpg?x-oss-process=image). Company capabilities are separate from Martin’s personal responsibilities and workbench photos.

Antigua page update: description and individual contribution precede seven ranked source links and two galleries (2 equipment photos, 6 people/team photos). Duplicate uploads and reuploaded TRS photos are not added to Antigua. Approx. 10,000 cumulative computers and 1,500 laptops in 2025 come from Antigua Observer (18 February 2025); 50+ labs and 2,400 computers refer to Rotary’s 2017 account. The exact user-supplied historical text is preserved in a dated expandable quotation, including its original Belleview spelling. Local television coverage is linked to ABS’s supplied AB Today interview; it is not represented as a personal interview with Martin. Martin confirmed his participation was in 2023 and that the Prime Minister of Antigua and Barbuda personally greeted the team over lunch.

Robotics now features the MAE 106 three-person pneumatic mobile robot report. Martin’s contribution is programming, calibration, wood fabrication and replacing failed supports. CAD/drivetrain, wiring and testing are credited to the appropriate teammates. Four original report images show hardware, two CAD views and wiring. One original 750 ms duty-cycle graph supports a team result of 6.774 s over 10 ft (n=10, SD 0.156 s). Earlier eight-person two-legged robotics work remains a separate project description. The unchanged report is downloadable.
