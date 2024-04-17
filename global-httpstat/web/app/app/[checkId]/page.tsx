import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Redis } from "@upstash/redis"
import { initResponseSchema } from "@/app/lib/schema"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import ms from "ms"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Chart } from "@/components/chart"
import { Separator } from "@/components/ui/separator"
import { Table, TableCaption, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


type Props = {
  params: {
    checkId: string
  }
  searchParams: {
    region?: string
  }
}

export default async function Page(props: Props) {
  const redis = Redis.fromEnv()


  const data = await redis.get(`check:${props.params.checkId}`)
  if (!data) {
    const { userId } = auth()
    await redis.zrem(`user:${userId}:checks`, props.params.checkId)
    return redirect("/app")
  }

  const check = initResponseSchema.parse(data)


  const time = Math.min(...Object.values(check.regions).flatMap(r => r.map(r => r.time)))


  const runs = props.searchParams.region ? check.regions[props.searchParams.region] : []



  const maxStatus = runs.reduce((acc, run) => {
    if (run.status > acc) {
      return run.status
    }
    return acc
  }, 0)

  const firstRun = Math.min(...runs.map(r => r.time))

  const latencies = runs.map(r => r.latency)
  const p50 = percentile(latencies, 0.5)
  const p90 = percentile(latencies, 0.9)
  const p99 = percentile(latencies, 0.99)


  const stats = [
    {
      label: "Runs",
      value: runs.length,

    },
    {
      label: "P50",
      value: Intl.NumberFormat(undefined, { notation: "compact" }).format(p50),
      unit: "ms"
    },
    {
      label: "P90",
      value: Intl.NumberFormat(undefined, { notation: "compact" }).format(p90),
      unit: "ms"

    },
    {
      label: "P99",
      value: Intl.NumberFormat(undefined, { notation: "compact" }).format(p99),
      unit: "ms"

    },
  ]

  return (
    <div className="w-full pt-14 -mt-28 h-screen">
      <div className="flex w-full">
        <ScrollArea className="h-screen w-1/2 pt-14 ">
          <div className="flex flex-col gap-2 p-4">
            {Object.entries(check.regions).map(([regionId, runs]) => (
              <Link
                key={regionId}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  props.searchParams.region === regionId && "bg-muted"
                )}
                href={`/app/${props.params.checkId}?region=${regionId}`}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{regionNames[regionId] ?? regionId}</div>

                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        props.searchParams.region === regionId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {ms(Date.now() - time)} ago
                    </div>
                  </div>
                  {/* <div className="text-xs font-medium">{item.subject}</div> */}
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {/* {item.text.substring(0, 300)} */}
                </div>
                <div className="flex items-center gap-2">
                  {stats.map((stat) => (
                    <Badge key={stat.label} className="font-mono" >{stat.label}: {stat.value}{stat.unit}</Badge>
                  ))}

                </div>

              </Link>
            ))}
          </div>

        </ScrollArea>
        <Separator orientation="vertical" className="h-[calc(100vh-3.5rem)] mt-14" />
        <div className=" w-1/2 pt-14 h-screen overflow-y-hidden">
          {runs.length > 0 ? (


            <div className="flex flex-1 flex-col">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Badge className={cn("rounded-full h-8 w-8 flex font-mono text-xs items-center justify-center", {
                    "bg-green-500": maxStatus < 400,
                    "bg-yellow-500": maxStatus >= 400 && maxStatus < 500,
                    "bg-red-500": maxStatus >= 500,
                  })}>
                    {maxStatus}
                  </Badge>
                  <div className="grid gap-1">
                    <div className="font-semibold">{check.request.url}</div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Method:</span> {check.request.method}
                    </div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Region:</span> {regionNames[props.searchParams.region!]}
                    </div>

                  </div>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {ms(Date.now() - firstRun)} ago
                </div>

              </div>
              <Separator />
              <div className="grid grid-cols-4">
                {stats.map(stat => (
                  <div key={stat.label} className="px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-sm font-medium leading-6 text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-primary font-mono">{stat.value}</span>
                      {stat.unit ? <span className="text-sm text-muted-foreground font-mono">{stat.unit}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />

              <div className="w-full h-32">
                <Chart data={runs.map(({ time, latency }) => ({ x: new Date(time).toUTCString(), y: latency }))} />
              </div>
              <Separator className="mt-auto" />
              <ScrollArea className="h-96">
                <Table>
                  <TableCaption>A list of all runs.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.map((run, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-xs whitespace-nowrap">{new Date(run.time).toUTCString()}</TableCell>
                        <TableCell><Badge>{run.status}</Badge></TableCell>
                        <TableCell className="text-right font-mono">{Intl.NumberFormat(undefined, { "notation": "compact" }).format(run.latency)} ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </ScrollArea>
            </div>
          ) :
            <div className="flex items-center justify-center w-full h-screen -mt-14 bg-muted ">
              <p className="text-muted-foreground text-sm">
                Select a region on the left
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}



const regionNames: Record<string, string> = {
  "arn": "Stockholm, Sweden",
  "bom": "Mumbai, India",
  "cdg": "Paris, France",
  "cle": "Cleveland, USA",
  "cpt": "Cape Town, South Africa",
  "dub": "Dublin, Ireland",
  "fra": "Frankfurt, Germany",
  "gru": "São Paulo, Brazil",
  "hkg": "Hong Kong",
  "hnd": "Tokyo, Japan",
  "iad": "Washington, D.C., USA",
  "icn": "Seoul, South Korea",
  "kix": "Osaka, Japan",
  "lhr": "London, United Kingdom",
  "pdx": "Portland, USA",
  "sfo": "San Francisco, USA",
  "sin": "Singapore",
  "syd": "Sydney, Australia",
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) {
    return 0;
  }

  let index = (arr.length - 1) * p,
    lower = Math.floor(index),
    upper = lower + 1,
    weight = index % 1;

  if (upper >= arr.length) {
    return arr[lower];
  }
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}
