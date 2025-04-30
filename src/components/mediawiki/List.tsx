'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaExternalLinkAlt, FaRegEdit } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";

import { useNamespaces } from "@/hooks/mediawiki/useNamespaces";
import { usePlatforms } from "@/hooks/platforms/usePlatforms";

import { useToken } from "@/context/TokenContext";
import { IPlatformProps } from "@/utils/interfaces";

interface TableItem {
  value: any;
  align: "left" | "right" | "center";
}

const TableHeaderCell = ({ item }: { item: TableItem }) => {
  return (
    <th scope="col" className={`px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider text-${item.align} cursor-default`}>
      {item.value}
    </th>
  )
}

const TableCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
  )
}

const TagsCell = ({ tags }: { tags: string[] }) => {

  return (
    <TableCell>
      <div className="flex flex-wrap gap-1 text-xs text-gray-900">
        {tags.map((tag, idx) => <span key={idx} className="px-2 py-1 bg-base-200 text-base-400 rounded-full cursor-default">{tag}</span>)}
      </div>
    </TableCell>
  )
}

const UrlCell = ({ url, path = '' }: { url: string, path?: string }) => {
  return (
    <TableCell>
      <div className="flex flex-wrap gap-1 text-sm text-gray-900">
        <a href={`${url}${path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2"><span>{url}{path}</span><FaExternalLinkAlt size={10} /></a>
      </div>
    </TableCell>
  )
}

const TextCell = ({ value }: { value: string }) => {
  return (
    <TableCell>{value}</TableCell>
  )
}

const ActionDropdown = ({ actions }: { actions: { href: string, icon: React.ReactNode, label: string }[] }) => {
  return (
    <TableCell>
      <div className="flex items-center justify-end">
        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-square btn-sm btn-ghost"><IoMdMore /></div>
          <ul className="dropdown-content menu bg-base-100 rounded-xl z-[1] text-xs w-40 p-1 shadow border border-base-200">
            {actions.map((action, index) => (
              <li key={index}>
                <Link href={action.href} className="flex items-center justify-start gap-2">
                  {action.icon}
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TableCell>
  )
}

const LoadingCell = () => {
  return (
    <TableCell><div className="skeleton h-4 w-20"></div></TableCell>
  )
}


const MediaWikiRow = ({ platform }: { platform: IPlatformProps }) => {

  const url = `${platform.metadata.baseURL}${platform.metadata.path}`;
  console.log(url)
  const { data, isLoading } = useNamespaces(url);

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const tags = platform.metadata.namespace.map((key: number) => {
      if (key === 0) return "Articles"
      const namespace = data?.query?.namespaces[key]
      return namespace ? namespace.canonical : "Unknown"
    })
    setTags(tags);
  }, [data]);


  return (
    <tr>
      <UrlCell url={platform.metadata.baseURL} />
      <TextCell value={platform.metadata.path} />
      {isLoading ? <LoadingCell /> : <TagsCell tags={tags} />}
      <ActionDropdown actions={[{ href: `${platform.id}/edit`, icon: <FaRegEdit />, label: "Edit" }]} />
    </tr>
  )
}

const Pagination = ({ page, setPage, totalPages, limit, totalResults }: { page: number, setPage: (page: number) => void, totalPages: number, limit: number, totalResults: number }) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Mobile Pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          className="btn btn-sm btn-square btn-ghost"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <FaChevronLeft />
        </button>
        <button
          className="btn btn-sm btn-square btn-ghost"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
      {/* Desktop Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-700 font-mono">
            Showing <span className="font-semibold">{page * limit - limit + 1}</span> to <span className="font-semibold">{page * limit > totalResults ? totalResults : page * limit}</span> of{' '}
            <span className="font-semibold">{totalResults}</span> results
          </p>
        </div>
        <div>
          <nav className="join" aria-label="Pagination">
            <button
              className="join-item btn btn-sm btn-square btn-ghost"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>
            <button
              className="join-item btn btn-sm btn-square btn-ghost"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaChevronRight />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
export default function MediaWikiList() {
  const { community } = useToken();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [results, setResults] = useState<IPlatformProps[]>([]);

  const { data, isLoading } = usePlatforms(community?.id, "mediaWiki", page, limit);

  useEffect(() => {
    setTotalResults(data?.totalResults || 0);
    setTotalPages(data?.totalPages || 0);
    setResults(data?.results || []);
  }, [data]);

  return (
    <>
      <table className="min-w-full divide-y divide-base-200">
        <thead>
          <tr>
            <TableHeaderCell item={{ value: "Base URL", align: "left" }} />
            <TableHeaderCell item={{ value: "API Path", align: "left" }} />
            <TableHeaderCell item={{ value: "Namespaces", align: "left" }} />
            <TableHeaderCell item={{ value: "Actions", align: "right" }} />
          </tr>
        </thead>
        <tbody className="divide-y divide-base-200">

          {isLoading && (
            Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx}>
                <LoadingCell />
                <LoadingCell />
                <LoadingCell />
              </tr>
            ))
          )}

          {results.length === 0 && !isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <p className="text-xs">No entries found.</p>
                  <Link href="new" className="btn">Add MediaWiki</Link>
                </div>
              </td>
            </tr>
          )}

          {results.map((platform, idx: number) => (
            <MediaWikiRow key={idx} platform={platform} />
          ))}
        </tbody>
      </table >
      <Pagination page={page} setPage={setPage} totalPages={totalPages} limit={limit} totalResults={totalResults} />
    </>
  );
}
