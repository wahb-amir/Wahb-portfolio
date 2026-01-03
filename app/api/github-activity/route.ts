import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // store in .env.local

const query = `
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const username = "wahb-amir"; // your GitHub username

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const json = await response.json();

    const weeks =
      json.data.user.contributionsCollection.contributionCalendar.weeks;

    // Transform to ActivityCalendar format
    const activityData: { date: string; count: number; level: number }[] = [];

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const count = day.contributionCount;
        let level = 0;
        if (count === 0) level = 0;
        else if (count < 2) level = 1;
        else if (count < 5) level = 2;
        else if (count < 10) level = 3;
        else level = 4;

        activityData.push({ date: day.date, count, level });
      });
    });

    return NextResponse.json(activityData);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub activity" },
      { status: 500 }
    );
  }
}
