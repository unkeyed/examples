"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"
import { themes } from "@/registry/themes"
import { Separator } from "./ui/separator"

const theme = themes.find(t => t.name === "neutral")


type Props = {
  data: {
    x: string,
    y: number
  }[]
}

export const Chart: React.FC<Props> = ({ data }) => {


  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart

        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
        <Tooltip
          content={({ active, payload }) => {
            console.log({ payload })
            if (active && payload && payload.length) {

              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Latency
                    </span>
                    <span className="font-bold text-muted-foreground">
                      {Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(payload[0].value))} ms
                    </span>
                    <Separator className="my-2" />
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Time
                    </span>
                    <span className="font-bold text-muted-foreground">
                      {new Date(payload[0].payload?.x).toLocaleString().trim()}
                    </span>


                  </div>
                </div>
              )
            }

            return null
          }}
        />

        <Line
          type="monotone"
          dataKey="y"
          strokeWidth={2}
          unit="ms"
          activeDot={{
            r: 8,
            style: { fill: "var(--theme-primary)" },
          }}
          style={
            {
              stroke: "var(--theme-primary)",
              "--theme-primary": `hsl(${theme?.cssVars.light.primary
                })`,
            } as React.CSSProperties
          }
        />
        <YAxis hide domain={["dataMin", "dataMax"]} />
      </LineChart>
    </ResponsiveContainer>
  )
}
