const width = 900;
const height = 600;
const padding = 60;

const svg = d3.select("svg").attr("width", width).attr("height", height);
const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(data => {
    data.forEach(d => {
      d.Time = new Date("1970-01-01T00:" + d.Time);
    });

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
      .range([padding, width - padding]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Time))
      .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Time))
      .attr("r", 6)
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => d.Time.toISOString())
      .attr("fill", d => d.Doping ? "#f43f5e" : "#38bdf8")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(
          `<strong>${d.Name}</strong> (${d.Nationality})<br/>
          Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br/>
          ${d.Doping ? d.Doping : "No doping allegations"}`
        )
        .attr("data-year", d.Year)
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 60 + "px");
      })
      .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));

    const legend = svg.append("g").attr("id", "legend");

    legend.append("circle").attr("cx", width - 180).attr("cy", 250).attr("r", 6).attr("fill", "#f43f5e");
    legend.append("text").attr("x", width - 165).attr("y", 254).attr("class", "legend").text("Riders with doping allegations");
    legend.append("circle").attr("cx", width - 180).attr("cy", 275).attr("r", 6).attr("fill", "#38bdf8");
    legend.append("text").attr("x", width - 165).attr("y", 279).attr("class", "legend").text("No doping allegations");
  });
