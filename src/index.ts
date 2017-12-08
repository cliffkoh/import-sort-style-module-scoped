import { IStyleAPI, IStyleItem } from "import-sort-style";
/* tslint:disable */
interface IImport {
  start: number;
  end: number;
  importStart?: number;
  importEnd?: number;
  type: ImportType;
  moduleName: string;
  defaultMember?: string;
  namespaceMember?: string;
  namedMembers: NamedMember[];
}

declare type ImportType = "import" | "require" | "import-equals" | "import-type";
declare type NamedMember = {
  name: string;
  alias: string;
};

export default function (styleApi: IStyleAPI): Array<IStyleItem> {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  function isScopedModule(imported: IImport) {
    return imported.moduleName[0] === '@';
  }

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "foo";
    {
      match: and(isAbsoluteModule, not(isScopedModule)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "foo";
    {
      match: isScopedModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}
